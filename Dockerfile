#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.0-buster-slim AS base
WORKDIR /app
EXPOSE 1994

FROM mcr.microsoft.com/dotnet/core/sdk:3.0-buster AS build
WORKDIR /src
COPY ["TemplateCore/TemplateCore.csproj", "TemplateCore/"]
COPY ["DTO/DTO.csproj", "DTO/"]
COPY ["Common/Common.csproj", "Common/"]
RUN dotnet restore "TemplateCore/TemplateCore.csproj"
COPY . .
WORKDIR "/src/TemplateCore"
RUN dotnet build "TemplateCore.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TemplateCore.csproj" -c Release -o /app/publish

RUN  sed -i s@/archive.ubuntu.com/@/mirrors.163.com/@g /etc/apt/sources.list
RUN  sed -i 's#/deb.debian.org#/mirrors.aliyun.com#g' /etc/apt/sources.list
RUN  apt-get clean
RUN apt-get update -y
RUN apt-get install -y --no-install-recommends libgdiplus libc6-dev
RUN apt-get update -y
RUN apt-get install -y --no-install-recommends libgdiplus libc6-dev

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TemplateCore.dll"]