package com.systructure.service;

import com.systructure.exception.AuthException;
import com.systructure.model.User;
import com.systructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthorizationService authorizationService;

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Update the authenticated user's profile.
     * Supports username change and password change (requires current password verification).
     */
    @Transactional
    public User updateProfile(String username, String currentPassword, String newPassword) {
        Long userId = authorizationService.getCurrentUserId();
        if (userId == null) {
            throw new AuthException("Not authenticated");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found"));

        if (username != null && !username.isBlank()) {
            String trimmed = username.trim();
            if (trimmed.length() < 2 || trimmed.length() > 50) {
                throw new IllegalArgumentException("Username must be between 2 and 50 characters");
            }

            Optional<User> existingUser = userRepository.findByUsername(trimmed);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                throw new IllegalArgumentException("Username is already taken");
            }

            user.setUsername(trimmed);
        }

        if (newPassword != null && !newPassword.isBlank()) {
            if (currentPassword == null || currentPassword.isBlank()) {
                throw new IllegalArgumentException("Current password is required to set a new password");
            }

            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                throw new AuthException("Current password is incorrect");
            }

            if (newPassword.length() < 8) {
                throw new IllegalArgumentException("New password must be at least 8 characters");
            }

            user.setPassword(passwordEncoder.encode(newPassword));
        }

        return userRepository.save(user);
    }
}
