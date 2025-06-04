import React from "react";
import styles from "./OrdersPage.module.css";
import OrderCard from "../components/OrderCard/OrderCard";

const OrdersPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Mis Pedidos</h1>
        <p className={styles.subtitle}>Gestiona y revisa todos tus pedidos</p>

        <OrderCard
          date="15/1/2025"
          status="entregado"
          products={[
            {
              image:
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748935575/CosmicX_xfvdog.png",
              name: "Cosmic X",
              model: "154W",
              quantity: 1,
              price: 599.99,
            },
          ]}
          total={599.99}
          productCount={1}
        />

        <OrderCard
          date="15/1/2025"
          status="enviado"
          products={[
            {
              image:
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903377/Cosmic_Y_utppmw.png",
              name: "Cosmic Y",
              model: "154W",
              quantity: 1,
              price: 399.99,
            },
          ]}
          total={399.99}
          productCount={1}
        />

        <OrderCard
          date="15/1/2025"
          status="pendiente"
          products={[
            {
              image:
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904515/Guantes_p94a8p.png",
              name: "Guantes térmicos",
              quantity: 1,
              price: 49.9,
            },
            {
              image:
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904517/Cera_gokfxx.png",
              name: "Cera para snowboard",
              quantity: 2,
              price: 9.9,
            },
          ]}
          total={69.7}
          productCount={3}
          showCancelButton
        />

        <OrderCard
          date="15/1/2025"
          status="cancelado"
          products={[
            {
              image:
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748935575/CosmicX_xfvdog.png",
              name: "Cosmic X",
              model: "154W",
              quantity: 1,
              price: 599.99,
            },
          ]}
          total={599.99}
          productCount={1}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
