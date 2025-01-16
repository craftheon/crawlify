import type { CollectionConfig } from "payload";


export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    defaultColumns: ["name", "email", "signUpType"],
    useAsTitle: "name",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "signUpType",
      type: "text",
    },
    {
      name: "role",
      type: "radio",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Member",
          value: "member",
        },
      ],
      defaultValue: "member",
      admin: {
        layout: "horizontal",
      },
    },
  ],
  timestamps: true,
};
