"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

function ToolbarButton({
  children,
  onClick,
  active = false,
  disabled = false,
  title,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-bold transition-all ${
        active
          ? "bg-[#14151A] text-white"
          : "text-[#555861] hover:bg-[#EEECE7] hover:text-[#14151A]"
      } disabled:cursor-not-allowed disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-[#E4E2DD]" />;
}

export default function RichTextEditor({
  value = "",
  onChange,
  error = false,
}) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),

      Placeholder.configure({
        placeholder: "محتوای اصلی مقاله را اینجا بنویسید...",
      }),
    ],

    content: value || "",

    editorProps: {
      attributes: {
        dir: "rtl",
        class:
          "tiptap-editor min-h-[420px] px-5 py-5 text-right text-sm leading-8 text-[#14151A] outline-none",
      },
    },

    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // برای حالت Edit
  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();

    if (value !== currentContent) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-[470px] animate-pulse rounded-2xl bg-[#F8F7F4]" />
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;

    const url = window.prompt(
      "آدرس لینک را وارد کنید:",
      previousUrl || "https://",
    );

    if (url === null) return;

    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url.trim(),
      })
      .run();
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-all ${
        error
          ? "border-[#FECDD3] ring-4 ring-[#FFF2F2]"
          : "border-[#E8E6E1] focus-within:border-[#FFCC00] focus-within:ring-4 focus-within:ring-[#FFF4E5]"
      }`}
    >
      {/* Toolbar */}
      <div
        dir="rtl"
        className="flex flex-wrap items-center gap-1 border-b border-[#F0EEE9] bg-[#FAF9F7] p-2"
      >
        {/* Undo / Redo */}
        <ToolbarButton
          title="برگشت"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶
        </ToolbarButton>

        <ToolbarButton
          title="انجام دوباره"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↷
        </ToolbarButton>

        <Divider />

        {/* Paragraph */}
        <ToolbarButton
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </ToolbarButton>

        {/* Headings */}
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("heading", { level: 4 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          H4
        </ToolbarButton>

        <Divider />

        {/* Bold */}
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <span className="text-sm font-black">B</span>
        </ToolbarButton>

        {/* Italic */}
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="text-sm italic">I</span>
        </ToolbarButton>

        {/* Strike */}
        <ToolbarButton
          title="Strike"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <span className="text-sm line-through">S</span>
        </ToolbarButton>

        <Divider />

        {/* Bullet List */}
        <ToolbarButton
          title="لیست"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          ☷
        </ToolbarButton>

        {/* Ordered List */}
        <ToolbarButton
          title="لیست شماره‌ای"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </ToolbarButton>

        {/* Blockquote */}
        <ToolbarButton
          title="نقل قول"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          ❝
        </ToolbarButton>

        {/* Code */}
        <ToolbarButton
          title="کد"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          {"</>"}
        </ToolbarButton>

        {/* Code Block */}
        <ToolbarButton
          title="بلوک کد"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {"{ }"}
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          title="افزودن لینک"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          🔗
        </ToolbarButton>

        {editor.isActive("link") && (
          <ToolbarButton title="حذف لینک" onClick={removeLink}>
            🔗×
          </ToolbarButton>
        )}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Footer */}
      <div
        dir="rtl"
        className="flex items-center justify-between border-t border-[#F0EEE9] bg-[#FAF9F7] px-4 py-2"
      >
        <span className="text-[10px] font-medium text-[#A0A4B0]">
          برای ایجاد تیتر، لیست و لینک از نوار ابزار استفاده کنید
        </span>

        <span className="text-[10px] font-bold text-[#A0A4B0]">
          {editor.storage.characterCount?.characters?.() || ""}
        </span>
      </div>
    </div>
  );
}
