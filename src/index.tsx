import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom/client";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import { getDateForPageWithoutBrackets } from "logseq-dateutils";
import FormatText from "./components/FormatText";
import handleClosePopup from "./handlePopup";

function provideStyle() {
  const { fontSize, lineHeight, fontFamily } = logseq.settings!;
  logseq.provideStyle(`
											:root {
											  font-size: ${fontSize.length > 0 ? fontSize : ""}px !important;
											  line-height: ${lineHeight.length > 0 ? lineHeight : ""} !important;
												font-family: ${fontFamily.length > 0 ? fontFamily : ""} !important;
											}
											`);
}

function main() {
  console.log("logseq-randomutils-plugin loaded");

  provideStyle();
  logseq.onSettingsChanged(function () {
    provideStyle();
  });

  logseq.App.registerCommandPalette(
    {
      key: "Open_block_in_right_sidebar",
      label: "Open block in right sidebar",
      keybinding: {
        binding: "ctrl+shift+o",
      },
    },
    function (e) {
      logseq.Editor.openInRightSidebar(e.uuid);
    }
  );

  logseq.App.registerCommandPalette(
    {
      key: "Go_to_today",
      label: "Go to today",
      keybinding: {
        binding: "ctrl+shift+t",
      },
    },
    async function () {
      logseq.App.pushState("page", {
        name: getDateForPageWithoutBrackets(
          new Date(),
          (await logseq.App.getUserConfigs()).preferredDateFormat
        ),
      });
    }
  );

  handleClosePopup();
  logseq.App.registerCommandPalette(
    {
      key: "Format_selected_text",
      label: "Format text",
    },
    async function () {
      const selectedBlocks = await logseq.Editor.getSelectedBlocks();
      if (selectedBlocks)
        ReactDOM.createRoot(
          document.getElementById("app") as HTMLElement
        ).render(
          <React.StrictMode>
            <FormatText selectedBlocks={selectedBlocks} />
          </React.StrictMode>
        );
      logseq.showMainUI();
    }
  );
}

const settings: SettingSchemaDesc[] = [
  {
    key: "heading",
    type: "heading",
    default: "",
    title:
      "These settings change basic CSS for all of Logseq. For specific customisations, please use a theme or modify custom.css",
    description: "",
  },
  {
    key: "fontSize",
    type: "string",
    default: "",
    title: "Font Size",
    description: "Sets the default font-size (in pixels)",
  },
  {
    key: "lineHeight",
    type: "string",
    default: "",
    title: "Line Height",
    description: "Sets the default line-height",
  },
  {
    key: "fontFamily",
    type: "string",
    default: "",
    title: "Font Family",
    description:
      'Sets the default font-family. Use inverted commas if your font has more than 1 word, e.g. "Times New Roman"',
  },
];

logseq.useSettingsSchema(settings).ready(main).catch(console.error);
