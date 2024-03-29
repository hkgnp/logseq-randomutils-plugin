export const sortBlocksOnPage = () => {
  logseq.App.registerPageMenuItem("Sort blocks", async ({ page }) => {
    const pageBlock = await logseq.Editor.getPage(page);
    if (!pageBlock) return;
    const pbt = await logseq.Editor.getPageBlocksTree(page);
    const pbtWithoutProperties = pbt.filter(
      (b) => !b.content.startsWith("icon::"),
    );
    const sortedPbt = pbtWithoutProperties.sort(function (a, b) {
      const string1 = /[a-zA-Z]+/.exec(a.content);
      const string2 = /[a-zA-Z]+/.exec(b.content);
      if (string1 && string2) {
        return string1[0].localeCompare(string2[0]);
      } else {
        return 0;
      }
    });
    pbtWithoutProperties.forEach(
      async (b) => await logseq.Editor.removeBlock(b.uuid),
    );
    sortedPbt.forEach(
      async (b) =>
        await logseq.Editor.insertBlock(pageBlock?.uuid, b.content, {
          customUUID: b.uuid,
        }),
    );
  });
};
