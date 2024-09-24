import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function DialogBox({ isOpen, onClose, task, editedContent, setEditedContent ,userTodo, setUserTodo}) {
    const {currentUser} = useSelector(state=> state.user)
  const handleSaveChanges = async() => {
    try {
        const res = await fetch(`/api/todo/update/${currentUser.userId}/${task.todoId}`,{
          method: "PUT",
          headers : {
            "Content-Type" :"application/json"
          },
          body : JSON.stringify({
            todo : editedContent,
            completed : task?.completed
          })
        });
        if(res.ok){
            toast.success("Task updated successfully")
            const updatedTodo = userTodo.map(item => item.todoId === task.todoId ? { ...item, todo: editedContent } : item);
            setUserTodo(updatedTodo);
            onClose();
        }
    } catch (error) {
        toast.error("Error in updating task", error)
    }
    
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`task-name-${task._id}`} className="text-right">
              Task
            </Label>
            <Input
              id={`task-name-${task._id}`}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}