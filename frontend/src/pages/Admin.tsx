import React, { useState } from "react";
import { Plus, X, UploadCloud, Edit, Trash2, Clipboard } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;
const Admin = () => {

  type Project = {
    name: string;
    description: string;
    image: string;
    skills: string[];
    github: string;
    live: string;
  };

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resume, setResume] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [newProjectVisible, setNewProjectVisible] = useState(false);
  const [newSkillVisible, setNewSkillVisible] = useState(false);

  const addProject = async (e) => {
    e.preventDefault();
    const form = e.target;

     const response = await fetch()
    const newProject = {
      image: form.image.files[0],
      title: form.title.value,
      description: form.description.value,
      skills: form.skills.value.split(",").map(s => s.trim())
    };
    setProjects([...projects, newProject]);
    form.reset();
    setNewProjectVisible(false);
  };

  const addSkill = (e) => {
    e.preventDefault();
    const form = e.target;
    setSkills([...skills, {
      name: form.skill.value,
      proficiency: form.proficiency.value
    }]);
    form.reset();
    setNewSkillVisible(false);
  };

  const uploadResume = (e) => {
    setResume(e.target.files[0]);
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const removeResume = () => {
    setResume(null);
  };

  // Helper function to get appropriate badge color based on proficiency
  const getProficiencyColor = (proficiency) => {
    const level = proficiency.toLowerCase();
    if (level.includes("expert") || level.includes("advanced")) return "bg-green-500";
    if (level.includes("intermediate")) return "bg-blue-500";
    if (level.includes("beginner")) return "bg-purple-500";
    return "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 text-gray-100">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Portfolio Admin</h1>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm text-gray-300">Admin Mode</span>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-8">
          <button 
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-3 font-medium text-sm transition-all ${activeTab === "projects" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400 hover:text-gray-300"}`}
          >
            Projects
          </button>
          <button 
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-3 font-medium text-sm transition-all ${activeTab === "skills" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400 hover:text-gray-300"}`}
          >
            Skills
          </button>
          <button 
            onClick={() => setActiveTab("resume")}
            className={`px-4 py-3 font-medium text-sm transition-all ${activeTab === "resume" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400 hover:text-gray-300"}`}
          >
            Resume
          </button>
        </div>
        
        {/* Projects Section */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
              <button 
                onClick={() => setNewProjectVisible(!newProjectVisible)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-sm font-medium"
              >
                {newProjectVisible ? (
                  <>
                    <X size={16} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    New Project
                  </>
                )}
              </button>
            </div>
            
            {/* Add Project Form */}
            {newProjectVisible && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg mb-6">
                <h3 className="text-lg font-medium mb-4">Add New Project</h3>
                <form onSubmit={addProject} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-400">Project Title</label>
                      <input 
                        name="title" 
                        placeholder="E.g. Portfolio Website" 
                        required 
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-400">Project Image</label>
                      <div className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm">
                        <UploadCloud size={16} className="text-gray-400" />
                        <input 
                          name="image" 
                          type="file" 
                          required 
                          className="w-full text-sm text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-500" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Description</label>
                    <textarea 
                      name="description" 
                      placeholder="Brief description of the project..." 
                      required 
                      rows="3"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">Skills (comma separated)</label>
                    <input 
                      name="skills" 
                      placeholder="React, Tailwind, Firebase, etc." 
                      required 
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" 
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setNewProjectVisible(false)}
                      className="px-4 py-2 border border-slate-600 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
                    >
                      Save Project
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Projects Grid */}
            {projects.length > 0 ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mt-6">
                {projects.map((proj, idx) => (
                  <div key={idx} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50 shadow-lg group hover:shadow-indigo-900/20 transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img 
                        src={URL.createObjectURL(proj.image)} 
                        alt={proj.title} 
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
                        <div className="flex gap-2">
                          <button className="p-1.5 bg-slate-800/90 rounded-lg hover:bg-indigo-600 transition-colors">
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => removeProject(idx)} 
                            className="p-1.5 bg-slate-800/90 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{proj.title}</h3>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{proj.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {proj.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-indigo-900/50 text-indigo-300 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {proj.skills.length > 3 && (
                          <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full">
                            +{proj.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-slate-800/50 inline-flex rounded-full p-3 mb-4">
                  <Clipboard className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-300">No projects yet</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">Add your first project to showcase your skills and experience.</p>
                <button 
                  onClick={() => setNewProjectVisible(true)} 
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add First Project
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Skills Section */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Skills ({skills.length})</h2>
              <button 
                onClick={() => setNewSkillVisible(!newSkillVisible)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors text-sm font-medium"
              >
                {newSkillVisible ? (
                  <>
                    <X size={16} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    New Skill
                  </>
                )}
              </button>
            </div>
            
            {/* Add Skill Form */}
            {newSkillVisible && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg mb-6">
                <h3 className="text-lg font-medium mb-4">Add New Skill</h3>
                <form onSubmit={addSkill} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-400">Skill Name</label>
                      <input 
                        name="skill" 
                        placeholder="E.g. React.js" 
                        required 
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-400">Proficiency Level</label>
                      <select
                        name="proficiency"
                        required
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      >
                        <option value="">Select level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setNewSkillVisible(false)}
                      className="px-4 py-2 border border-slate-600 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
                    >
                      Save Skill
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Skills List */}
            {skills.length > 0 ? (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 mt-6">
                {skills.map((skill, idx) => (
                  <div key={idx} className="bg-slate-800 rounded-xl border border-slate-700/50 shadow-md p-4 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`${getProficiencyColor(skill.proficiency)} h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold`}>
                        {skill.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium">{skill.name}</h3>
                        <span className="text-xs text-gray-400">{skill.proficiency}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeSkill(idx)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-slate-800/50 inline-flex rounded-full p-3 mb-4">
                  <Clipboard className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-300">No skills added yet</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">Add skills to highlight your expertise and technical abilities.</p>
                <button 
                  onClick={() => setNewSkillVisible(true)} 
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add First Skill
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Resume Section */}
        {activeTab === "resume" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Resume</h2>
            </div>
            
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
              {resume ? (
                <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                  <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400">
                      <Clipboard size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium">{resume.name}</h3>
                      <span className="text-xs text-gray-400">
                        {Math.round(resume.size / 1024)} KB · Uploaded {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors">
                      Preview
                    </button>
                    <button
                      onClick={removeResume}
                      className="px-3 py-1.5 text-xs bg-red-600/20 text-red-400 border border-red-900/30 rounded-lg hover:bg-red-600/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="bg-slate-700/40 inline-flex rounded-full p-3 mb-4">
                    <UploadCloud className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-300">Upload your resume</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">Support formats: PDF, DOCX (Max size: 5MB)</p>
                  
                  <div className="mt-6 max-w-md mx-auto">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500/50 hover:bg-slate-700/30 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-medium text-indigo-400">Click to upload</span> or drag and drop
                        </p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" onChange={uploadResume} />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;