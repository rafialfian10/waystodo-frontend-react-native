// components react
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

// components
import { UserContext } from "../../../Context/UserContext";

// api
import { API } from "../../../Config/api";
// -----------------------------------------------------------

export const GetUser = () => {
  const [state, dispatch] = useContext(UserContext);

  const { data: user, isLoading, refetch: refetchUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await API.get(`/user/${state?.user?.id}`);
      return data.data;
    }
  });

  return { user, isLoading, refetchUser };
};

