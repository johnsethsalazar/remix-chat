export const createCustomer = async ({ email, name }: any) => {
  return await prisma.customer.create({
    data: {
      id: "1234567",
      email: email,
      name: name,
    } as any,
  });
};
