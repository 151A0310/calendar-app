package com.tateishi.calendar_app.controller;

import com.tateishi.calendar_app.repository.TaskRepository;
import com.tateishi.calendar_app.entity.Task;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.Authentication;

@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://calendar-app-offk.vercel.app"
})
@RestController
@RequestMapping("/tasks")

public class TaskController {

    private final TaskRepository repo;

    public TaskController(TaskRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Task> getAll(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return repo.findByUserId(userId);
    }

    @PostMapping
    public Task create(@RequestBody Task task, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        task.setUserId(userId);
        return repo.save(task);
    }

    @PutMapping("/{id}")
    public Task update(@Valid @RequestBody Task task, @PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        Task existing = repo.findById(id).orElseThrow();

        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("権限がありません");
        }

        existing.setTitle(task.getTitle());
        existing.setStart(task.getStart());
        existing.setEnd(task.getEnd());
        existing.setColor(task.getColor());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        Task existing = repo.findById(id).orElseThrow();

        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("権限がありません");
        }

        repo.deleteById(id);
    }

    @GetMapping("/{id}")
    public Task getOne(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        Task task = repo.findById(id).orElseThrow();

        if (!task.getUserId().equals(userId)) {
            throw new RuntimeException("権限がありません");
        }

        return task;
    }

}
