package edu.jorge.proyectodaw.service;

import edu.jorge.proyectodaw.entity.WishList;

import java.util.List;

public interface WishListService {
    List<WishList> findAll();
    WishList findById(Long id);
    WishList save(WishList order);
    WishList update(Long id, WishList order);
    void delete(Long id);

    WishList findByUserId(Long userId);
    Boolean isInWishList(Long userId, Long productId);
}
