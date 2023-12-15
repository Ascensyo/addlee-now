import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();

  return (
    <Banner title="addlee-options">
      {translate("welcome", { target: extension.target })}
      Text
    </Banner>
  );
}