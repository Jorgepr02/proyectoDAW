package edu.jorge.proyectodaw.controller;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import edu.jorge.proyectodaw.service.impl.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class StripeController {

    @Autowired
    private StripeService stripeService;

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestParam Long amount) {
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
}
