package com.taskstudy.controller;


import com.taskstudy.model.Usuario;
import com.taskstudy.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController

@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/cadastro")
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()) != null) {
            return ResponseEntity.badRequest().build();
        }

        Usuario salvo = usuarioRepository.save(usuario);

        return ResponseEntity.ok(salvo);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario usuario) {

        Usuario existente = usuarioRepository.findByEmail(usuario.getEmail());

        if (existente == null || !existente.getSenha().equals(usuario.getSenha())) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(existente);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {

        Optional<Usuario> usuario = usuarioRepository.findById(id);

        return usuario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
