"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = (position + 1.0) * 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_theme; // 0.0 = dark, 1.0 = light
  varying vec2 vUv;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 mouse = u_mouse / u_resolution.xy;
    
    float t = u_time * 0.08;
    
    // Multi-octave atmospheric noise
    float n1 = snoise(uv * 1.8 + vec2(t * 0.4, t * 0.2));
    float n2 = snoise(uv * 3.2 - vec2(t * 0.3, -t * 0.5) + n1 * 0.4);
    float n3 = snoise(uv * 5.0 + vec2(n2 * 0.3, t * 0.2));
    
    float combinedNoise = (n1 * 0.5 + n2 * 0.35 + n3 * 0.15) * 0.5 + 0.5;
    
    // Distance from subtle dynamic sun orb near top right
    vec2 sunPos = vec2(0.8 + mouse.x * 0.1, 0.85 + mouse.y * 0.08);
    float sunDist = length(uv - sunPos);
    float sunGlow = exp(-sunDist * 3.5) * 0.8;
    
    // Aurora band near top left
    vec2 auroraPos = vec2(0.2, 0.9);
    float auroraDist = length(uv - auroraPos);
    float auroraGlow = exp(-auroraDist * 2.8) * combinedNoise;
    
    // Palette from public inspirations:
    // Dark mode colors:
    vec3 deepNavy = vec3(0.02, 0.06, 0.11);
    vec3 azureSky = vec3(0.35, 0.66, 0.90);
    vec3 amberSunset = vec3(0.95, 0.51, 0.16);
    vec3 goldSun = vec3(1.0, 0.84, 0.16);
    vec3 twilightViolet = vec3(0.33, 0.25, 0.48);
    vec3 cyanMist = vec3(0.29, 0.74, 0.80);
    
    // Light mode colors:
    vec3 lightSky = vec3(0.94, 0.96, 0.98);
    vec3 lightAzure = vec3(0.72, 0.86, 0.96);
    vec3 lightGold = vec3(1.0, 0.92, 0.65);
    
    vec3 baseColor = mix(deepNavy, twilightViolet * 0.6, uv.y * 0.5 + combinedNoise * 0.2);
    baseColor = mix(baseColor, azureSky * 0.4, auroraGlow * 0.6 + n2 * 0.15);
    baseColor += cyanMist * (n3 * 0.12);
    baseColor += mix(amberSunset, goldSun, sunGlow * 0.5) * sunGlow;
    
    vec3 lightBaseColor = mix(lightSky, lightAzure, uv.y * 0.4 + combinedNoise * 0.15);
    lightBaseColor += lightGold * (sunGlow * 0.5);

    vec3 finalColor = mix(baseColor, lightBaseColor, u_theme);
    
    // Soft atmospheric vignette
    float vignette = 1.0 - length(uv - 0.5) * 0.4;
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, 0.45);
  }
`;

export default function AtmosphericShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });

    if (!gl) return;

    function createShader(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vert = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posAttr = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const themeLoc = gl.getUniformLocation(program, "u_theme");

    let animationFrameId: number;
    const startTime = performance.now();
    let mouseX = window.innerWidth * 0.7;
    let mouseY = window.innerHeight * 0.3;

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const width = Math.floor(window.innerWidth * dpr * 0.6);
      const height = Math.floor(window.innerHeight * dpr * 0.6);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = window.innerHeight - e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let isVisible = true;
    const onVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    function render(currentTime: number) {
      if (isVisible && gl) {
        const elapsed = (currentTime - startTime) * 0.001;
        const isLight = document.documentElement.getAttribute("data-theme") === "light" ? 1.0 : 0.0;

        gl.uniform2f(resLoc, canvas!.width, canvas!.height);
        gl.uniform1f(timeLoc, elapsed);
        gl.uniform2f(mouseLoc, mouseX, mouseY);
        gl.uniform1f(themeLoc, isLight);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      cancelAnimationFrame(animationFrameId);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vert);
        gl.deleteShader(frag);
        gl.deleteBuffer(posBuffer);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60 transition-opacity duration-1000"
      aria-hidden
    />
  );
}
