"use client";

import { ReactNode } from "react";
import { Input, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

type ReusableEmailProps = {
  isRequired: boolean;
  label: string;
  labelAdd: string;
  labelInput: string;
  labelDelete: string;
  value: string[];
  onValueChange: (value: string[]) => void;
  errorMessage?: () => ReactNode;
};

export function ReusableEmail({
  isRequired,
  label,
  labelAdd,
  labelInput,
  labelDelete,
  value,
  onValueChange,
  errorMessage,
}: ReusableEmailProps) {
  const handleChange = (index: number, newValue: string) => {
    const updated = [...value];

    updated[index] = newValue;
    onValueChange(updated);
  };

  const handleAdd = () => {
    onValueChange([...value, ""]);
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);

    onValueChange(updated);
  };
  const errors = errorMessage ? errorMessage() : null;

  return (
    <div className="space-y-2 w-full">
      <label className="block text-sm font-medium text-secondary-800">
        {label}
        {isRequired && <span className="text-danger-500 ml-1">*</span>}
      </label>

      {value.map((email, index) => (
        <div key={index} className="flex items-start gap-2">
          <Input
            className="flex-1"
            endContent={
              <div className="flex justify-center items-center h-full">
                <Button
                  isIconOnly
                  aria-label={labelDelete}
                  color="danger"
                  type="button"
                  variant="light"
                  onPress={() => handleRemove(index)}
                >
                  <Icon
                    className="w-5 h-5"
                    icon="solar:trash-bin-trash-bold-duotone"
                  />
                </Button>
              </div>
            }
            label={labelInput}
            placeholder="Complete este campo"
            startContent={
              <Icon className="w-5 h-5" icon="solar:letter-broken" />
            }
            type="text"
            value={email}
            variant="bordered"
            onChange={(e) => handleChange(index, e.target.value)}
          />
        </div>
      ))}
      {errors && <div className="text-danger text-sm">{errors}</div>}
      <Button
        className="mt-2 w-full"
        color="success"
        type="button"
        variant="bordered"
        onPress={handleAdd}
      >
        <Icon className="w-6 h-6 mr-2" icon="solar:add-square-broken" />
        {labelAdd}
      </Button>
    </div>
  );
}
