package com.taskstudy.controller;

import com.taskstudy.model.Tarefa;
import com.taskstudy.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tarefas")
public class TarefaController {

    @Autowired
    private TarefaRepository tarefaRepository;


    @GetMapping("/usuario/{usuarioId}")
    public List<Tarefa> listarPorUsuario(@PathVariable Long usuarioId) {
        return tarefaRepository.findByUsuarioId(usuarioId);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Tarefa> buscarPorId(@PathVariable Long id) {
        Optional<Tarefa> tarefa = tarefaRepository.findById(id);
        return tarefa.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PostMapping
    public Tarefa criar(@RequestBody Tarefa tarefa) {
        return tarefaRepository.save(tarefa);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Tarefa> atualizar(@PathVariable Long id, @RequestBody Tarefa tarefaAtualizada) {
        Optional<Tarefa> optionalTarefa = tarefaRepository.findById(id);
        if (optionalTarefa.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Tarefa tarefa = optionalTarefa.get();

        tarefa.setTitulo(tarefaAtualizada.getTitulo());
        tarefa.setDescricao(tarefaAtualizada.getDescricao());
        tarefa.setDataEntrega(tarefaAtualizada.getDataEntrega());
        tarefa.setCategoria(tarefaAtualizada.getCategoria());
        tarefa.setStatus(tarefaAtualizada.getStatus());
        tarefa.setPrioridade(tarefaAtualizada.getPrioridade());
        tarefa.setUsuario(tarefaAtualizada.getUsuario());

        tarefaRepository.save(tarefa);
        return ResponseEntity.ok(tarefa);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!tarefaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        tarefaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
