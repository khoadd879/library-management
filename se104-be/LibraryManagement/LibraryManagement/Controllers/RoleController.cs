using LibraryManagement.Dto.Request;
using LibraryManagement.Dto.Response;
using LibraryManagement.Helpers;
using LibraryManagement.Repository.InterFace;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.Controllers
{
    [Route("api/roles/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private IRoleRepository _roleRepository;

        public RoleController(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        // Endpoint tạo role mới
        [HttpPost("add_role")]
        public async Task<ApiResponse<RoleResponse>> addNewRole(RoleRequest request)
        {
            return await _roleRepository.addRoleAsync(request);
        }

        // Endpoint xóa role
        [HttpDelete("delete_role")]
        public async Task<ApiResponse<string>> deleteRole(string RoleName)
        {
            return await _roleRepository.deleteRoleAsync(RoleName);
        }

        // Endpoint sửa role
        [HttpPut("update_role")]
        public async Task<ApiResponse<RoleResponse>> updateRole(RoleRequest request)
        {
            return await _roleRepository.updateRoleAsync(request);
        }
    }
}
