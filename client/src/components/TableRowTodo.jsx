import React, { useEffect, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

import {
  MoreHorizontal,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useSelector } from 'react-redux'
import DialogBox from './DialogBox'
import { toast } from 'react-toastify'
export default function TableRowTodo({task, setUserTodo, userTodo}) {
  const [user, setUser] = useState({});
  const {currentUser} = useSelector(state=> state.user)
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task?.todo);
  useEffect(()=>{
    const getUser = async()=>{
      try {
        // const res = await axios.get(`/api/user/${task.userId}`)
      } catch (error) {
        console.log(error)
      }
    }
    getUser();
  }, [task])
  
  const handleEdit = ()=>{
    setIsEditing(true);
    // setEditedContent(task?.name)
  }
  const [isChecked, setIsChecked] = useState(task?.completed || false);
  const handleCheckboxChange = async () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    try {
      const res = await fetch(`/api/todo/update/${currentUser?.userId}/${task?.todoId}`, {
        method : "PUT",
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify({
          todo :task?.todo,
          completed : newCheckedState
        })
        
      });
      if (res.ok) {
        const updatedTodos = userTodo.map(todo =>
          todo.todoId=== task.todoId ? { ...todo, completed: newCheckedState } : todo
        );
        setUserTodo(updatedTodos);
        console.log(userTodo)
      }
    } catch (error) {
      toast.error("Error in updating task", error);
    }
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    
    // Format the date
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 
    const day = ('0' + date.getDate()).slice(-2);
    
    // Format the time
    let hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    hours = ('0' + hours).slice(-2);
    
    // Construct the formatted date string
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes} ${period}`;
    
    return formattedDate;
  };

  const handleDelete = async() => {
    try {
      const res = await fetch(`/api/todo/delete/${currentUser?.userId}/${task?.todoId}`,{
        method : "DELETE",
      }

      );
      const data = await res.json();
      if (res.ok) {
        toast.success(`${data?.message}`);
        setUserTodo(userTodo.filter(todo => todo?.todoId !== task?.todoId));
      }
    } catch (error) {
      toast.error("Error in deleting task");
      console.log(error);
    }
  }
  return (
    <>
      <TableRow className="p-0 m-0 bg-gray-100 dark:bg-slate-900">
        <TableCell className="sm:table-cell">
          <Checkbox checked={task?.completed} onClick={handleCheckboxChange} />
        </TableCell>
        <TableCell className={`min-w-36 p-0 m-0 text-[12px] sm:text-[14px] ${task?.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
          {task?.todo}
        </TableCell>
        <TableCell className="p-0 m-0 text-[11px] lg:text-[14px]">
          {formatDate(task?.createdAt)}
        </TableCell>
        <TableCell className="p-0 m-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-haspopup="true"
                size="icon"
                variant="ghost"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick = {handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {isEditing && (
        <DialogBox
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          task={task}
          editedContent={editedContent}
          setEditedContent={setEditedContent}
          setUserTodo = {setUserTodo}
          userTodo = {userTodo}
        />
      )}
    </>
  );
}