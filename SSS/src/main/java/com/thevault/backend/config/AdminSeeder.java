package com.thevault.backend.config;

import com.thevault.backend.model.Role;
import com.thevault.backend.model.User;
import com.thevault.backend.repository.UserRepository;
import com.thevault.backend.security.PasswordUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * The public /api/auth/signup endpoint only ever creates USER accounts (a
 * signup form that lets you tick "make me an admin" would be a security
 * hole). This seeds exactly one ADMIN account from config/env on first boot
 * so there's a way in. Change the password after first login.
 */
@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordUtil passwordUtil;

    @Value("${app.admin.email:admin@thevault-jewelry.com}")
    private String adminEmail;

    @Value("${app.admin.password:ChangeMe123!}")
    private String adminPassword;

    public AdminSeeder(UserRepository userRepository, PasswordUtil passwordUtil) {
        this.userRepository = userRepository;
        this.passwordUtil = passwordUtil;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }
        User admin = new User("Studio Admin", adminEmail, passwordUtil.hash(adminPassword), Role.ADMIN);
        userRepository.save(admin);
        System.out.println("[AdminSeeder] Created default admin account: " + adminEmail);
    }
}
