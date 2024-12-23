package com.adm.employeemanagement.security;

import com.adm.employeemanagement.service.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtre JWT pour valider le token et authentifier l'utilisateur dans le SecurityContext.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthFilter(JwtUtils jwtUtils, CustomUserDetailsService userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Méthode principale du filtre : on intercepte la requête,
     * on récupère le token, on le valide, puis on authentifie si tout est correct.
     */
    @Override
    protected void doFilterInternal(final HttpServletRequest request,
                                    final HttpServletResponse response,
                                    final FilterChain filterChain) throws ServletException, IOException {
        try {
            final String jwt = parseJwt(request);
            if (jwt != null) {
                final String username = jwtUtils.getUsernameFromToken(jwt);

                // Vérifie qu'il y a un username ET que personne n'est déjà authentifié dans ce contexte
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    final UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    // Valide le token en comparaison avec les infos de l'utilisateur
                    if (jwtUtils.validateToken(jwt, userDetails)) {
                        // Crée l'authentication de Spring
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities() // Autorités associées à l'utilisateur
                                );
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        // Place l'authentification dans le contexte de sécurité
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            }
        } catch (ExpiredJwtException e) {
            LOGGER.warn("Le token JWT est expiré : {}", e.getMessage());
        } catch ( MalformedJwtException e) {
            LOGGER.error("Le token JWT est invalide : {}", e.getMessage());
        } catch (Exception e) {
            // On capture tout autre type d'exception pour éviter de compromettre l'application
            LOGGER.error("Erreur lors de la validation du token JWT : {}", e.getMessage());
        }

        // On poursuit la chaîne de filtres (important pour que la requête continue son parcours)
        filterChain.doFilter(request, response);
    }

    /**
     * Extrait le token JWT de l'en-tête Authorization
     * (format attendu : "Bearer <token>").
     *
     * @param request HttpServletRequest
     * @return Le token JWT, ou null s'il est absent ou mal formé
     */
    private String parseJwt(final HttpServletRequest request) {
        final String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7); // Supprime "Bearer "
        }
        return null;
    }
}
