/* ImageResponse renders an embedded raster; next/image is not supported here. */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { portfolio } from "@/content/portfolio";

export const alt = "Aleph Rafael — Cloud e infraestrutura. Em busca da primeira oportunidade.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const font = await readFile(join(process.cwd(), "node_modules/@fontsource/geist/files/geist-latin-600-normal.woff"));

  const avatar = await readFile(join(process.cwd(), "public/brand/hooded-avatar.png"));
  const avatarData = `data:image/png;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 72px", color: "#edf1fa", background: "linear-gradient(110deg, #090d15 35%, #182c54)", fontFamily: "Geist", position: "relative" }}>
      <div style={{ position: "absolute", right: -130, top: -80, width: 650, height: 650, borderRadius: "50%", border: "1px solid #355285", display: "flex" }} />
      <div style={{ position: "absolute", right: -55, top: -5, width: 500, height: 500, borderRadius: "50%", border: "1px solid #355285", display: "flex" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><img src={avatarData} width={88} height={88} alt="" /><span style={{ fontSize: 18, letterSpacing: 3, color: "#b3c9ff" }}>PORTFÓLIO PESSOAL</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}><span style={{ fontSize: 24, color: "#b1bcd1" }}>{portfolio.name}</span><span style={{ fontSize: 70, letterSpacing: -3 }}>Cloud &</span><span style={{ fontSize: 70, letterSpacing: -3, color: "#8cadff", marginTop: -24 }}>Infraestrutura.</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #3a4863", paddingTop: 24 }}><span style={{ fontSize: 21, color: "#c2cde1" }}>Meu primeiro passo em tecnologia.</span><span style={{ fontSize: 18, color: "#99b6ff" }}>APRENDER · CONSTRUIR · DOCUMENTAR</span></div>
    </div>,
    { ...size, fonts: [{ name: "Geist", data: Uint8Array.from(font).buffer, style: "normal", weight: 600 }] },
  );
}
