// components react
import { useQuery } from "@tanstack/react-query";

// api
import { API } from "../../../Config/api";
// -----------------------------------------------------------

export const GetCategoriesUser = () => {
  const { data: categoriesUser, refetch: refetchCategoriesUser } = useQuery({
    queryKey: ['categories-user'],
    queryFn: async () => {
      const { data } = await API.get(`categories-user`);
      return data.data;
    }
  });

  return { categoriesUser, refetchCategoriesUser };
};

