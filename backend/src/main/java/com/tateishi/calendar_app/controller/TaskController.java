package com.tateishi.calendar_app.controller;

import com.tateishi.calendar_app.repository.TaskRepository;
import com.tateishi.calendar_app.entity.Task;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskRepository repo;

    public TaskController(TaskRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Task> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Task getOne(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    @PostMapping
    public Task create(@Valid @RequestBody Task task) {
        return repo.save(task);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    @PutMapping("/{id}")
    public Task update(@Valid @RequestBody Task task, @PathVariable Long id) {
        Task existing = repo.findById(id).orElseThrow();
        existing.setTitle(task.getTitle());
        existing.setStart(task.getStart());
        existing.setEnd(task.getEnd());
        existing.setColor(task.getColor());
        return repo.save(existing);
    }
}
