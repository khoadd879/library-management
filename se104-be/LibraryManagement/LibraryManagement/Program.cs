using LibraryManagement.Data;
using LibraryManagement.Helpers.Interface;
using LibraryManagement.Helpers;
using LibraryManagement.Repository;
using LibraryManagement.Repository.IRepository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LibraryManagement.Repository.InterFace;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Cấu hình cho phép tất cả các ứng dụng được gọi đến API
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
 policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

// Tạo chữ ký kết nối
var ConnectionString = builder.Configuration.GetConnectionString("PostgreSQLConnection");

// Đăng ký dbContex
builder.Services.AddDbContext<LibraryManagermentContext>(options =>
    options.UseNpgsql(ConnectionString));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Đăng ký sử dụng Mapper
builder.Services.AddAutoMapper(typeof(Program));

// Tạo service sử dụng JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new
    Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"]))
    };
});


// Life cycle DI
builder.Services.AddScoped<IReaderRepository, ReaderRepository>();
builder.Services.AddScoped<IAuthenRepository, AuthenRepository>();
builder.Services.AddScoped<ITokenGenerator, TokenGenerator>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
