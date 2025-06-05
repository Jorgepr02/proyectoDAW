package edu.jorge.proyectodaw.controller;

import edu.jorge.proyectodaw.controller.dto.input.WishListPatchInputDTO;
import edu.jorge.proyectodaw.controller.dto.output.ProductListOutputDTO;
import edu.jorge.proyectodaw.entity.Product;
import edu.jorge.proyectodaw.entity.WishList;
import edu.jorge.proyectodaw.service.ProductService;
import edu.jorge.proyectodaw.service.UserService;
import edu.jorge.proyectodaw.service.WishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/wishlists")
public class WishListController {

    @Autowired
    private WishListService wishListService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductListOutputDTO>> findAll() {
        List<Product> products = new ArrayList<>();
        List<WishList> wishLists = wishListService.findAll();
        for (WishList wishList : wishLists) {
            for (Product product : wishList.getProducts()) {
                products.add(product);
            }
        }

        List<ProductListOutputDTO> productDTOs = new ArrayList<>();
        for (Product product : products) {
            productDTOs.add(convertToListDTO(product));
        }

        return ResponseEntity.ok(productDTOs);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ProductListOutputDTO>> findByUserId(@PathVariable Long userId) {
        List<ProductListOutputDTO> productListOutputDTOs = mapWishListToProductDTOs(
                wishListService.findByUserId(userId)
        );

        return ResponseEntity.ok(productListOutputDTOs);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProductListOutputDTO>> findAllByUserId(
            @PathVariable Long userId
    ) {
        WishList wishList = wishListService.findByUserId(userId);
        if (wishList == null || wishList.getProducts().isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }
        List<ProductListOutputDTO> productListOutputDTOs = mapWishListToProductDTOs(wishList);

        return ResponseEntity.ok(productListOutputDTOs);
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> isInWishList(
            @RequestParam Long userId,
            @RequestParam Long productId
    ) {

        if (wishListService.isInWishList(userId, productId)) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        }
    }

    @PatchMapping
    public ResponseEntity<List<ProductListOutputDTO>> addProductToWishList(
            @RequestParam String productAction,
            @RequestBody WishListPatchInputDTO wishListPatchInputDTO
    ) {
        WishList wishList = wishListService.findByUserId(wishListPatchInputDTO.getUserId());
        if (wishList.getId() == null) {
            wishList = wishListService.save(
                    new WishList(
                           userService.findById(
                                   wishListPatchInputDTO.getUserId()
                           )
                    )
            );
        }

        if (productAction.equals("add")) {
            wishList.addProduct(
                    productService.findById(
                            wishListPatchInputDTO.getProductId()
                    )
            );
        } else if (productAction.equals("remove")) {
            wishList.removeProduct(
                    productService.findById(
                            wishListPatchInputDTO.getProductId()
                    )
            );
        } else {
            return ResponseEntity.badRequest().build();
        }


        wishListService.save(wishList);

        List<ProductListOutputDTO> productListOutputDTOs = mapWishListToProductDTOs(wishList);

        return ResponseEntity.ok(productListOutputDTOs);
    }

    private ProductListOutputDTO convertToListDTO(Product product) {
        ProductListOutputDTO dto = new ProductListOutputDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getName());
        } else {
            dto.setCategoryName("No Category");
        }
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            dto.setImages(product.getImages());
        } else {
            dto.setImages(Collections.emptyList());
        }
        return dto;
    }

    public List<ProductListOutputDTO> mapWishListToProductDTOs(WishList wishList) {
        List<ProductListOutputDTO> productDTOs = new ArrayList<>();
        for (Product product : wishList.getProducts()) {
            ProductListOutputDTO dto = new ProductListOutputDTO();
            dto.setId(product.getId());
            dto.setName(product.getName());
            dto.setPrice(product.getPrice());
            if (product.getCategory() != null) {
                dto.setCategoryName(product.getCategory().getName());
            } else {
                dto.setCategoryName("No Category");
            }
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                dto.setImages(product.getImages());
            } else {
                dto.setImages(Collections.emptyList());
            }
            productDTOs.add(dto);
        }
        return productDTOs;
    }
}

