import { useUser } from "../composables/composables";
import router from "./index";

router.beforeEach((to, from) => {
  console.log("router gurad", to.name);
  const { user } = useUser();
  if (!user.auth && to.name !== "Login" && to.name !== "CreateAccount") {
    return { name: "CreateAccount" };
  }
});

export default router;
