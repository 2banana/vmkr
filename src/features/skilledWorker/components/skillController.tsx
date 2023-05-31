interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  selected: DropdownOption;
  options: DropdownOption[];
  onSelectOption: (selectedOption: DropdownOption) => void;
}

const SkillController = ({
  selected,
  options,
  onSelectOption,
}: DropdownProps) => {
  {
    const handleSelectOption = (option: DropdownOption) => {
      onSelectOption(option);
    };

    return (
      <div>
        <select
          value={selected.value}
          onChange={(e) => {
            const selectedValue = e.target.value;
            const option = options.find((opt) => opt.value === selectedValue);
            if (option) {
              handleSelectOption(option);
            }
          }}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {selected && <p>Selected option: {selected.label}</p>}
      </div>
    );
  }
};

export { SkillController };
export type { DropdownOption };
