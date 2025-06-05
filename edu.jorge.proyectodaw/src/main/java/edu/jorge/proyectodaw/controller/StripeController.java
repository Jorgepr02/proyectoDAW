package edu.jorge.proyectodaw.controller;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import edu.jorge.proyectodaw.entity.Order;
import edu.jorge.proyectodaw.repositories.OrderRepo;
import edu.jorge.proyectodaw.service.OrderService;
import edu.jorge.proyectodaw.service.impl.OrderPaymentService;
import edu.jorge.proyectodaw.service.impl.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class StripeController {

    @Autowired
    private StripeService stripeService;

    @Autowired
    private OrderPaymentService orderPaymentService;

    @Autowired
    private OrderRepo orderRepository;

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(
            @RequestParam Long orderId,
            @RequestParam Long amount
    ) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() ->
                            new IllegalArgumentException("Pedido no encontrado: " + orderId));

            long expectedCents = Math.round(order.getAmount() * 100);
            if (amount != expectedCents) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error",
                                "El importe enviado (" + amount +
                                        ") no coincide con el del pedido (" + expectedCents + ")."));
            }

            PaymentIntent intent = stripeService.createPaymentIntent(amount, "eur");

            return ResponseEntity.ok(Map.of(
                    "clientSecret", intent.getClientSecret(),
                    "paymentIntentId", intent.getId()
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/create2")
    public ResponseEntity<?> createPayment2(@RequestParam Long amount) {
        try {
            PaymentIntent intent = stripeService.createPaymentIntent(amount, "eur");
            Map<String, String> responseData = Map.of(
                    "clientSecret", intent.getClientSecret()
            );
            return ResponseEntity.ok(responseData);

        } catch (StripeException e) {
            return ResponseEntity
                    .status(500)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/seeStatus")
    public ResponseEntity<?> findPayment(
            @RequestParam Long orderId,
            @RequestParam String paymentIntentId
    ) {
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

            if ("succeeded".equals(paymentIntent.getStatus())) {
                Order order = orderService.markAsPaid(orderId, paymentIntent.getId(), paymentIntent.getStatus());

                return ResponseEntity.ok(Map.of(
                        "message", "Pedido marcado como pagado",
                        "orderId", order.getId()
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "El pago no se ha completado. Estado: " + paymentIntent.getStatus()
                ));
            }
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{orderId}/pay")
    public ResponseEntity<?> payOrder(
            @PathVariable Long orderId,
            @RequestParam Long clientId
    ) {
        try {
            // TODO shippingDetails método en PaymentIntent
            PaymentIntent intent = orderPaymentService.initiatePayment(clientId, orderId);
            orderService.markAsPaid(orderId, intent.getId(), intent.getStatus());

            return ResponseEntity.ok().body(
                    Map.of("clientSecret", intent.getClientSecret())
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
