import prisma from '../prismaClient.ts';

export const productRepository = {
   getProduct(productId: number) {
      return prisma.product.findUnique({
         where: { id: productId },
      });
   },
};
