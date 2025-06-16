import { useState } from "react";
import { PlusOutlined, EditOutlined, SaveOutlined, DeleteOutlined, CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { message } from "antd";

interface IPermission {
  id: string;
  name: string;
  description: string;
  permissions: {
    receiveBooks: boolean;
    manageUsers: boolean;
    borrowBooks: boolean;
    viewLists: boolean;
    viewReports: boolean;
  };
}

const AdminPermissionManagement = () => {
  const [permissions, setPermissions] = useState<IPermission[]>([
    {
      id: "1",
      name: "Admin",
      description: "Toàn quyền hệ thống",
      permissions: {
        receiveBooks: true,
        manageUsers: true,
        borrowBooks: true,
        viewLists: true,
        viewReports: true,
      },
    },
    {
      id: "2",
      name: "User",
      description: "Quyền cơ bản",
      permissions: {
        receiveBooks: false,
        manageUsers: false,
        borrowBooks: true,
        viewLists: true,
        viewReports: false,
      },
    },
  ]);

  const [editingPermission, setEditingPermission] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    description: ""
  });
  const [isAddingPermission, setIsAddingPermission] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<IPermission | null>(permissions[0]);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    permissions: ""
  });

  const validatePermission = (permission: IPermission) => {
    const newErrors = {
      name: "",
      permissions: ""
    };
    
    if (!permission.name.trim()) {
      newErrors.name = "Vui lòng nhập tên quyền";
    }
    
    const hasPermission = Object.values(permission.permissions).some(val => val);
    if (!hasPermission) {
      newErrors.permissions = "Vui lòng chọn ít nhất 1 quyền";
    }
    
    setErrors(newErrors);
    return !newErrors.name && !newErrors.permissions;
  };

  const handlePermissionChange = (permissionId: string, field: keyof IPermission['permissions']) => {
    if (!isEditingMode) return;
    
    setPermissions(prev =>
      prev.map(perm =>
        perm.id === permissionId
          ? {
              ...perm,
              permissions: {
                ...perm.permissions,
                [field]: !perm.permissions[field],
              },
            }
          : perm
      )
    );

    if (selectedPermission && selectedPermission.id === permissionId) {
      const updatedPermission = {
        ...selectedPermission,
        permissions: {
          ...selectedPermission.permissions,
          [field]: !selectedPermission.permissions[field],
        },
      };
      setSelectedPermission(updatedPermission);
      
      // Clear permission error when any permission is selected
      if (errors.permissions) {
        setErrors(prev => ({...prev, permissions: ""}));
      }
    }
  };

  const startEditing = (permissionId: string) => {
    if (!isEditingMode) return;
    
    setEditingPermission(permissionId);
    const perm = permissions.find(p => p.id === permissionId);
    if (perm) {
      setEditData({
        name: perm.name,
        description: perm.description
      });
    }
  };

  const saveEditing = (permissionId: string) => {
    const permissionToSave = {
      ...permissions.find(p => p.id === permissionId)!,
      name: editData.name,
      description: editData.description
    };
    
    if (!validatePermission(permissionToSave)) return;
    
    setPermissions(prev =>
      prev.map(perm =>
        perm.id === permissionId
          ? permissionToSave
          : perm
      )
    );
    setEditingPermission(null);
    setSelectedPermission(permissionToSave);
  };

  const cancelEditing = () => {
    setEditingPermission(null);
    setErrors({
      name: "",
      permissions: ""
    });
    if (isAddingPermission) {
      deletePermission(editingPermission!);
      setIsAddingPermission(false);
    }
  };

  const addNewPermission = () => {
    if (!isEditingMode) return;
    
    setIsAddingPermission(true);
    const newId = (permissions.length + 1).toString();
    const newPerm: IPermission = {
      id: newId,
      name: "",
      description: "",
      permissions: {
        receiveBooks: false,
        manageUsers: false,
        borrowBooks: false,
        viewLists: false,
        viewReports: false,
      },
    };
    setPermissions([...permissions, newPerm]);
    setEditingPermission(newId);
    setEditData({
      name: "",
      description: ""
    });
    setSelectedPermission(newPerm);
  };

  const saveNewPermission = () => {
    if (!editData.name.trim()) {
      setErrors(prev => ({...prev, name: "Vui lòng nhập tên quyền"}));
      return;
    }
    
    const hasPermission = selectedPermission 
      ? Object.values(selectedPermission.permissions).some(val => val)
      : false;
    
    if (!hasPermission) {
      setErrors(prev => ({...prev, permissions: "Vui lòng chọn ít nhất 1 quyền"}));
      return;
    }
    
    const newPermission = {
      ...selectedPermission!,
      name: editData.name,
      description: editData.description
    };
    
    setPermissions(prev =>
      prev.map(perm =>
        perm.id === editingPermission
          ? newPermission
          : perm
      )
    );
    setIsAddingPermission(false);
    setEditingPermission(null);
    setErrors({
      name: "",
      permissions: ""
    });
    message.success("Thêm quyền mới thành công");
  };

  const deletePermission = (permissionId: string) => {
    if (permissions.length <= 1 || !isEditingMode) return;
    
    setPermissions(prev => prev.filter(perm => perm.id !== permissionId));
    if (selectedPermission && selectedPermission.id === permissionId) {
      setSelectedPermission(permissions[0]);
    }
  };

  const toggleEditMode = () => {
    setIsEditingMode(!isEditingMode);
    setEditingPermission(null);
    setIsAddingPermission(false);
    setErrors({
      name: "",
      permissions: ""
    });
  };

  const saveAllChanges = () => {
    // Validate all permissions
    const invalidPermissions = permissions.filter(p => 
      !p.name.trim() || !Object.values(p.permissions).some(val => val)
    );
    
    if (invalidPermissions.length > 0) {
      message.error("Vui lòng kiểm tra lại các quyền chưa hợp lệ");
      return;
    }
    
    setIsEditingMode(false);
    setEditingPermission(null);
    setIsAddingPermission(false);
    message.success("Lưu thay đổi thành công");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#f4f7f9] min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý quyền</h1>
          {isEditingMode ? (
            <div className="flex gap-2">
              <button
                onClick={saveAllChanges}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <SaveOutlined /> Lưu lại
              </button>
            </div>
          ) : (
            <button
              onClick={toggleEditMode}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <EditOutlined /> Chỉnh sửa
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Permission List */}
          <div className="w-full md:w-1/3">
            <div className="mb-4">
              {isEditingMode && (
                <button
                  onClick={addNewPermission}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-full justify-center"
                >
                  <PlusOutlined /> Thêm quyền mới
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {permissions.map(permission => (
                <div
                  key={permission.id}
                  className={`p-4 rounded-lg cursor-pointer transition ${
                    selectedPermission?.id === permission.id
                      ? "bg-blue-100 border border-blue-300"
                      : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                  } ${
                    isEditingMode ? "border-dashed border-2 border-blue-200" : ""
                  }`}
                  onClick={() => setSelectedPermission(permission)}
                >
                  <div className="flex justify-between items-center">
                    {editingPermission === permission.id ? (
                      <div className="w-full">
                        <div className="mb-2">
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => {
                              setEditData({...editData, name: e.target.value});
                              if (errors.name) setErrors(prev => ({...prev, name: ""}));
                            }}
                            placeholder="Tên quyền"
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.name ? "border-red-500" : ""
                            }`}
                            autoFocus
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <ExclamationCircleOutlined className="mr-1" />
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <textarea
                          value={editData.description}
                          onChange={(e) => setEditData({...editData, description: e.target.value})}
                          placeholder="Mô tả quyền"
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          rows={3}
                        />
                      </div>
                    ) : (
                      <div className="w-full">
                        <h3 className="font-medium">{permission.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                      </div>
                    )}
                    {isEditingMode && (
                      <div className="flex gap-2 ml-2">
                        {editingPermission === permission.id ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isAddingPermission) {
                                  saveNewPermission();
                                } else {
                                  saveEditing(permission.id);
                                }
                              }}
                              className="text-green-500 hover:text-green-700"
                              title="Lưu"
                            >
                              <SaveOutlined />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(permission.id);
                              }}
                              className="text-blue-500 hover:text-blue-700"
                              title="Sửa"
                            >
                              <EditOutlined />
                            </button>
                            {permission.id !== "1" && permission.id !== "2" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deletePermission(permission.id);
                                }}
                                className="text-red-500 hover:text-red-700"
                                title="Xóa"
                              >
                                <DeleteOutlined />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Permission Details */}
          <div className="flex-1">
            {selectedPermission ? (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Chi tiết quyền: {selectedPermission.name}
                  </h3>
                  <p className="text-gray-600">{selectedPermission.description}</p>
                </div>
                
                {errors.permissions && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                    <ExclamationCircleOutlined className="mr-2" />
                    {errors.permissions}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${
                    isEditingMode ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Tiếp nhận sách</h4>
                        <p className="text-sm text-gray-600">Cho phép tiếp nhận sách mới vào thư viện</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedPermission.permissions.receiveBooks}
                          onChange={() => handlePermissionChange(selectedPermission.id, 'receiveBooks')}
                          className="sr-only peer"
                          disabled={!isEditingMode}
                        />
                        <div className={`w-11 h-6 ${isEditingMode ? 'bg-gray-200' : 'bg-gray-100'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500`}></div>
                      </label>
                      
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg border ${
                    isEditingMode ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Thêm độc giả/tác giả</h4>
                        <p className="text-sm text-gray-600">Cho phép thêm mới độc giả và tác giả</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedPermission.permissions.manageUsers}
                          onChange={() => handlePermissionChange(selectedPermission.id, 'manageUsers')}
                          className="sr-only peer"
                          disabled={!isEditingMode}
                        />
                        <div className={`w-11 h-6 ${isEditingMode ? 'bg-gray-200' : 'bg-gray-100'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500`}></div>
                      </label>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${
                    isEditingMode ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Mượn trả sách</h4>
                        <p className="text-sm text-gray-600">Cho phép quản lý quá trình mượn và trả sách</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedPermission.permissions.borrowBooks}
                          onChange={() => handlePermissionChange(selectedPermission.id, 'borrowBooks')}
                          className="sr-only peer"
                          disabled={!isEditingMode}
                        />
                        <div className={`w-11 h-6 ${isEditingMode ? 'bg-gray-200' : 'bg-gray-100'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500`}></div>
                      </label>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${
                    isEditingMode ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Danh sách</h4>
                        <p className="text-sm text-gray-600">Cho phép xem các danh sách sách, độc giả, tác giả</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedPermission.permissions.viewLists}
                          onChange={() => handlePermissionChange(selectedPermission.id, 'viewLists')}
                          className="sr-only peer"
                          disabled={!isEditingMode}
                        />
                        <div className={`w-11 h-6 ${isEditingMode ? 'bg-gray-200' : 'bg-gray-100'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500`}></div>
                      </label>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${
                    isEditingMode ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Báo cáo</h4>
                        <p className="text-sm text-gray-600">Cho phép xem các báo cáo thống kê</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedPermission.permissions.viewReports}
                          onChange={() => handlePermissionChange(selectedPermission.id, 'viewReports')}
                          className="sr-only peer"
                          disabled={!isEditingMode}
                        />
                        <div className={`w-11 h-6 ${isEditingMode ? 'bg-gray-200' : 'bg-gray-100'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500`}></div>
                      </label>
                    </div>
                  </div>

                  {/* Các permission khác giữ nguyên */}
                  {/* ... */}
                  
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Vui lòng chọn một quyền để xem chi tiết
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPermissionManagement;