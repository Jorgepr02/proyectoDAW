package edu.jorge.proyectodaw.service.impl;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import edu.jorge.proyectodaw.entity.Client;
import edu.jorge.proyectodaw.entity.Order;
import edu.jorge.proyectodaw.enums.OrderStatus;
import edu.jorge.proyectodaw.enums.PaymentMethod;
import edu.jorge.proyectodaw.repositories.ClientRepo;
import edu.jorge.proyectodaw.repositories.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class OrderPaymentService {

    @Autowired
    private OrderRepo orderRepository;

    @Autowired
    private ClientRepo clientRepository;

    @Autowired
    private StripeService stripeService;

    @Transactional
    public PaymentIntent initiatePayment(Long clientId, Long orderId) throws StripeException {
        Optional<Client> optClient = clientRepository.findById(clientId);
        if (optClient.isEmpty()) {
            throw new IllegalArgumentException("Cliente no encontrado con ID: " + clientId);
        }
        Client client = optClient.get();

        Optional<Order> optOrder = orderRepository.findById(orderId);
        if (optOrder.isEmpty()) {
            throw new IllegalArgumentException("Pedido no encontrado con ID: " + orderId);
        }
        Order order = optOrder.get();

        if (!order.getClient().getId().equals(client.getId())) {
            throw new IllegalArgumentException("El pedido " + orderId +
                    " no corresponde al cliente " + clientId);
        }

        if (order.getOrderStatus() != OrderStatus.NEW &&
                order.getOrderStatus() != OrderStatus.PENDING) {
            throw new IllegalArgumentException("El pedido ya ha sido procesado o pagado. Estado actual: "
                    + order.getOrderStatus());
        }

        long amountCents = Math.round(order.getAmount() * 100);

        PaymentIntent intent = stripeService.createPaymentIntent(amountCents, "usd");

        order.setPaymentIntentId(intent.getId());
        order.setStripePaymentStatus(intent.getStatus());
        order.setOrderPaymentMethod(PaymentMethod.STRIPE);
        order.setOrderStatus(OrderStatus.PENDING);

        orderRepository.save(order);

        return intent;
    }
}
