export const permissions = {
  admin: {
    read: true,
    create: true,
    update: true,
    delete: true,
    manageMembers: true,
  },
  editor: {
    read: true,
    create: true,
    update: true,
    delete: false,
    manageMembers: false,
  },
  viewer: {
    read: true,
    create: false,
    update: false,
    delete: false,
    manageMembers: false,
  },
};
