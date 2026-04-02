import { fireEvent, screen } from "@testing-library/react";
import { LanguageProvider } from "./LanguageProvider";
import useLanguage from "../../hooks/useLanguage/useLanguage";
import { render } from "@testing-library/react";

const TestConsumer = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <div>
      <span>{lang}</span>
      <button onClick={toggleLang}>toggle</button>
    </div>
  );
};

describe("LanguageProvider", () => {
  it("toggles between french and english", async () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>,
    );

    expect(screen.getByText("fr")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByText("en")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByText("fr")).toBeInTheDocument();
  });
});
