export const useNavbarBottom = defineStore("useNavbarBottom", () => {
  const bottomNavbar = reactive({
    isActionButtonVisible: true,
    isActionButtonMenuVisible: false,
    isVisible: false,
    items: [
      {
        route: "chamber",
        text: "Chamber",
      },
    ] as IActionMenuItem[],
  });

  return { bottomNavbar };
});

export interface IActionMenuItem {
  href: string;
  text: string;
  route: string;
}

export default useNavbarBottom;
