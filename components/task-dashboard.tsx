"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Search, Plus, LogOut, Pencil, Trash2 } from "lucide-react"
import TaskModal from "@/components/task-modal"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export interface Task {
  id: string
  title: string
  description: string
  category: string
  status: "todo" | "inprogress" | "onapproval" | "done"
  createdAt: string
  assignee?: string
}

export default function TaskDashboard() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    // Load user
    const user = localStorage.getItem("todoUser")
    if (user) {
      const userData = JSON.parse(user)
      setUserEmail(userData.email)
    }

    // Load tasks or create sample data
    const savedTasks = localStorage.getItem("todoTasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      const sampleTasks: Task[] = [
        {
          id: "1",
          title: "Restaurant Case",
          description: "Design restaurant booking interface",
          category: "Commerce",
          status: "todo",
          createdAt: new Date().toISOString(),
          assignee: "JD",
        },
        {
          id: "2",
          title: "Banking App Mobile",
          description: "Mobile banking application",
          category: "Commerce",
          status: "todo",
          createdAt: new Date().toISOString(),
          assignee: "AS",
        },
        {
          id: "3",
          title: "Health Care Shot",
          description: "Healthcare dashboard design",
          category: "Commerce",
          status: "inprogress",
          createdAt: new Date().toISOString(),
          assignee: "MK",
        },
        {
          id: "4",
          title: "Mercedes Case",
          description: "Automotive website redesign",
          category: "Commerce",
          status: "inprogress",
          createdAt: new Date().toISOString(),
          assignee: "LT",
        },
        {
          id: "5",
          title: "Porsche Case",
          description: "Luxury car showcase",
          category: "Medium",
          status: "onapproval",
          createdAt: new Date().toISOString(),
          assignee: "RW",
        },
        {
          id: "6",
          title: "Logotype #2",
          description: "Brand identity design",
          category: "Medium",
          status: "done",
          createdAt: new Date().toISOString(),
          assignee: "JD",
        },
      ]
      setTasks(sampleTasks)
      localStorage.setItem("todoTasks", JSON.stringify(sampleTasks))
    }
  }, [])

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks)
    localStorage.setItem("todoTasks", JSON.stringify(updatedTasks))
  }

  const handleLogout = () => {
    localStorage.removeItem("todoUser")
    router.push("/")
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    saveTasks(updatedTasks)
  }

  const handleSaveTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    if (editingTask) {
      const updatedTasks = tasks.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task))
      saveTasks(updatedTasks)
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        createdAt: new Date().toISOString(),
      }
      saveTasks([...tasks, newTask])
    }
    setIsModalOpen(false)
  }

  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress")
  const onApprovalTasks = tasks.filter((task) => task.status === "onapproval")
  const doneTasks = tasks.filter((task) => task.status === "done")

  const handlePrevDate = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const handleNextDate = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const totalTasks = tasks.length
  const completedPercentage = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-[#1E293B]">Design boards</h1>
              <div className="flex items-center gap-2 bg-[#F8FAFC] rounded-lg px-3 py-2">
                <button onClick={handlePrevDate} className="hover:bg-white rounded p-1">
                  <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                </button>
                <span className="text-sm font-medium text-[#1E293B] min-w-[120px] text-center">
                  {formatDate(currentDate)}
                </span>
                <button onClick={handleNextDate} className="hover:bg-white rounded p-1">
                  <ChevronRight className="w-4 h-4 text-[#64748B]" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-[#F8FAFC] rounded-lg">
                <Search className="w-5 h-5 text-[#64748B]" />
              </button>
              <Button onClick={handleAddTask} className="bg-[#E0E7FF] text-[#2563EB] hover:bg-[#C7D2FE]">
                <Plus className="w-4 h-4 mr-2" />
                Add task
              </Button>
              <button onClick={handleLogout} className="p-2 hover:bg-[#F8FAFC] rounded-lg">
                <LogOut className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-6">
        <div className="grid grid-cols-4 gap-4">
          {/* To do column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#1E293B]">To do</h2>
              <span className="text-xs text-[#64748B]">{todoTasks.length}</span>
            </div>
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-4 bg-[#FFFBEB] border-[#FEF3C7] border-l-4 border-l-[#F59E0B] hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-[#1E293B] text-sm">{task.title}</h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button onClick={() => handleEditTask(task)} className="p-1 hover:bg-white/50 rounded">
                        <Pencil className="w-3 h-3 text-[#64748B]" />
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-1 hover:bg-white/50 rounded">
                        <Trash2 className="w-3 h-3 text-[#EF4444]" />
                      </button>
                    </div>
                  </div>
                  <span className="inline-block px-2 py-1 bg-white rounded text-xs text-[#F59E0B] font-medium mb-3">
                    {task.category}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748B]">{formatDate(new Date(task.createdAt))}</span>
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-[#E0E7FF] text-[#2563EB] text-xs">
                        {task.assignee || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* In progress column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#1E293B]">In progress</h2>
              <span className="text-xs text-[#64748B]">{inProgressTasks.length}</span>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-4 bg-[#EEF2FF] border-[#E0E7FF] border-l-4 border-l-[#6366F1] hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-[#1E293B] text-sm">{task.title}</h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button onClick={() => handleEditTask(task)} className="p-1 hover:bg-white/50 rounded">
                        <Pencil className="w-3 h-3 text-[#64748B]" />
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-1 hover:bg-white/50 rounded">
                        <Trash2 className="w-3 h-3 text-[#EF4444]" />
                      </button>
                    </div>
                  </div>
                  <span className="inline-block px-2 py-1 bg-white rounded text-xs text-[#6366F1] font-medium mb-3">
                    {task.category}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748B]">{formatDate(new Date(task.createdAt))}</span>
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-[#E0E7FF] text-[#2563EB] text-xs">
                        {task.assignee || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* On approval column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#1E293B]">On approval</h2>
              <span className="text-xs text-[#64748B]">{onApprovalTasks.length}</span>
            </div>
            <div className="space-y-3">
              {onApprovalTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-4 bg-[#ECFDF5] border-[#D1FAE5] border-l-4 border-l-[#10B981] hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-[#1E293B] text-sm">{task.title}</h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button onClick={() => handleEditTask(task)} className="p-1 hover:bg-white/50 rounded">
                        <Pencil className="w-3 h-3 text-[#64748B]" />
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-1 hover:bg-white/50 rounded">
                        <Trash2 className="w-3 h-3 text-[#EF4444]" />
                      </button>
                    </div>
                  </div>
                  <span className="inline-block px-2 py-1 bg-white rounded text-xs text-[#10B981] font-medium mb-3">
                    {task.category}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748B]">{formatDate(new Date(task.createdAt))}</span>
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-[#E0E7FF] text-[#2563EB] text-xs">
                        {task.assignee || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Done column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#1E293B]">Done</h2>
              <span className="text-xs text-[#64748B]">{doneTasks.length}</span>
            </div>
            <div className="space-y-3">
              {doneTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-4 bg-[#FDF2F8] border-[#FCE7F3] border-l-4 border-l-[#EC4899] hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-[#1E293B] text-sm">{task.title}</h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button onClick={() => handleEditTask(task)} className="p-1 hover:bg-white/50 rounded">
                        <Pencil className="w-3 h-3 text-[#64748B]" />
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-1 hover:bg-white/50 rounded">
                        <Trash2 className="w-3 h-3 text-[#EF4444]" />
                      </button>
                    </div>
                  </div>
                  <span className="inline-block px-2 py-1 bg-white rounded text-xs text-[#EC4899] font-medium mb-3">
                    {task.category}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748B]">{formatDate(new Date(task.createdAt))}</span>
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-[#E0E7FF] text-[#2563EB] text-xs">
                        {task.assignee || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  )
}
