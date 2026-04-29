package com.tateishi.calendar_app.repository;

import com.tateishi.calendar_app.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
