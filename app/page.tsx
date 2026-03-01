import Nav from "@/components/Nav";
import TxSimApp from "@/components/TxSimApp";

export default function Home() {
  return (
    <div
      style={{
        position: "relative",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Scanline */}
      <div aria-hidden className="scanline" />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          paddingTop: "72px",
        }}
      >
        <Nav />
        <TxSimApp />
      </div>
    </div>
  );
}
