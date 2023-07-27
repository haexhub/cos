export const useActionMenu = defineStore("useActionMenu", () => {
  const actionMenu = reactive({
    items: [
      { text: "Login", route: "/login" },
      { text: "Sign Up" },
    ] as IActionMenuItem[],
    isMenuVisible: false,
    isButtonVisible: true,
  });

  return {
    actionMenu,
  };
});

export interface IActionMenuItem {
  href: string;
  action: () => void;
  text: string;
  route: string;
}
