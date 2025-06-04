package edu.jorge.proyectodaw.service.impl;

import edu.jorge.proyectodaw.entity.WishList;
import edu.jorge.proyectodaw.repositories.WishListRepo;
import edu.jorge.proyectodaw.service.WishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishListServiceImpl implements WishListService {

    @Autowired
    private WishListRepo wishListRepo;


    @Override
    public List<WishList> findAll() {
        return wishListRepo.findAll();
    }

    @Override
    public WishList findById(Long id) {
        return wishListRepo.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("WishList not found with id: " + id)
                );
    }

    @Override
    public WishList save(WishList wishList) {
        return wishListRepo.save(wishList);
    }

    @Override
    public WishList update(Long id, WishList wishList) {
        return null;
    }

    @Override
    public void delete(Long id) {

    }

    @Override
    public WishList findByUserId(Long userId) {
        List<WishList> wishLists = wishListRepo.findAll();
        for (WishList wishList : wishLists) {
            if (wishList.getUser().getId().equals(userId)) {
                return wishList;
            }
        }
        return new WishList();
    }

    @Override
    public Boolean isInWishList(Long userId, Long productId) {
        return wishListRepo.findByUser_IdAndProducts_Id(userId, productId)
                .isPresent();
    }
}
