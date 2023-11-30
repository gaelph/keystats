import React from "react";
import { DatesProvider } from "./date.js";
import { FetchContextProvider } from "./fetch.js";
import { KeyboardProvider } from "./keyboard.js";
import { KeyboardDataProvider } from "./keyboardData.js";
import { KeyboardsProvider } from "./keyboards.js";

export default function ApplicationStateProvider({
  children,
}: React.PropsWithChildren): React.ReactElement {
  return (
    <FetchContextProvider>
      <KeyboardsProvider>
        <KeyboardProvider>
          <DatesProvider>
            <KeyboardDataProvider>{children}</KeyboardDataProvider>
          </DatesProvider>
        </KeyboardProvider>
      </KeyboardsProvider>
    </FetchContextProvider>
  );
}
