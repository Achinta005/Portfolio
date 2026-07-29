import UiRouter from "./ui-router";

export default function RootPage() {
  return <UiRouter envUi={process.env.PORTFOLIO_UI} />;
}
