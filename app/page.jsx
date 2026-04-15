import Scene from "./Scene";

export default function Page() {
  return (
    <main
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Scene />
    </main>
  );
}