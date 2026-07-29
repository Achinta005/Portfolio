import UiRouter from "../ui-router";

export default function SlugPage() {
  return <UiRouter envUi={process.env.PORTFOLIO_UI} />;
}
