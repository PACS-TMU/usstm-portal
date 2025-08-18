"use client";

import Select from "react-select";

export default function OrganizingGroupsSelect({
    organizingGroups,
    selectedGroups,
    onChange,
}: {
    organizingGroups: { id: string; username: string }[];
    selectedGroups: string[];
    onChange: (ids: string[]) => void;
}) {
    const options = organizingGroups.map((group) => ({
        value: group.id,
        label: group.username,
    }));

    const value = options.filter((opt) =>
        selectedGroups.includes(opt.value)
    );

    return (
        <div>
            <label
                htmlFor="organizingGroups"
                className="block text-sm font-semibold text-gray-700 mb-1"
            >
                Organizing Group(s)
                <span className="text-red-500">*</span>
            </label>
            <Select
                instanceId="organizing-groups-select"
                inputId="organizingGroups"
                options={options}
                isMulti
                value={value}
                onChange={(selected) =>
                    onChange(selected.map((s) => s.value))
                }
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select groups..."
            />
            <p className="text-xs lg:text-sm text-gray-500 mt-1 mx-2">
                You can pick multiple groups from the dropdown.
            </p>
        </div>
    );
}
