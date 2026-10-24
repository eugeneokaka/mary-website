import { Node } from "@tiptap/core";

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const rounded = unit === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[unit]}`;
}

export const Attachment = Node.create({
  name: "attachment",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML: (element) => element.getAttribute("href"),
      },
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-name"),
      },
      size: {
        default: null,
        parseHTML: (element) => {
          const raw = element.getAttribute("data-size");
          const parsed = raw ? Number(raw) : NaN;
          return Number.isFinite(parsed) ? parsed : null;
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "a[data-attachment]" }];
  },

  renderHTML({ node }) {
    const name = (node.attrs.name as string | null) || "Download file";
    const size = formatFileSize(node.attrs.size as number | null);

    return [
      "a",
      {
        href: node.attrs.href,
        "data-attachment": "",
        "data-name": name,
        "data-size": node.attrs.size ?? "",
        download: name,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "attachment-card",
      },
      ["span", { class: "attachment-badge" }, "FILE"],
      [
        "span",
        { class: "attachment-details" },
        ["span", { class: "attachment-name" }, name],
        ["span", { class: "attachment-size" }, size || "Download"],
      ],
      ["span", { class: "attachment-action" }, "Download"],
    ];
  },
});
