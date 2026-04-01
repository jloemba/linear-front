import type { IClothUpdatePayload } from "../../../types/cloth";
import {
  inputClassName,
  labelClassName,
  panelClassName,
  type ClothEditorMessages,
} from "../clothEditorUi";

interface Props {
  form: IClothUpdatePayload;
  editor: ClothEditorMessages;
  onUpdateField: (field: "name" | "type" | "description", value: string) => void;
}

const ClothIdentitySection = ({ form, editor, onUpdateField }: Props) => (
  <section className={`${panelClassName} overflow-hidden`}>
    <div className="border-b border-stone-200 px-6 py-5">
      <h2 className="mt-2 text-2xl font-semibold text-stone-900">
        {editor.clothInformation}
      </h2>
    </div>

    <div className="grid gap-5 p-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className={labelClassName} htmlFor="graph-name">
          {editor.name}
        </label>
        <input
          id="graph-name"
          className={inputClassName}
          value={form.name}
          onChange={(event) => onUpdateField("name", event.target.value)}
          placeholder={editor.clothName}
        />
      </div>

      <div>
        <label className={labelClassName} htmlFor="graph-type">
          {editor.type}
        </label>
        <input
          id="graph-type"
          className={inputClassName}
          value={form.type}
          onChange={(event) => onUpdateField("type", event.target.value)}
          placeholder="HIP_HOP"
        />
      </div>

      <div className="md:col-span-2">
        <label className={labelClassName} htmlFor="graph-description">
          {editor.description}
        </label>
        <textarea
          id="graph-description"
          className={`${inputClassName} min-h-32 resize-y`}
          value={form.description ?? ""}
          onChange={(event) => onUpdateField("description", event.target.value)}
          placeholder={editor.descriptionPlaceholder}
        />
      </div>
    </div>
  </section>
);

export default ClothIdentitySection;
