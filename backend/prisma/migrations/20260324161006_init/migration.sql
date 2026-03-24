-- CreateTable
CREATE TABLE "programas_academicos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "facultad" TEXT NOT NULL,
    "duracionSemestres" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programas_academicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudiantes" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "codigoEstudiantil" TEXT NOT NULL,
    "documentoIdentidad" TEXT NOT NULL,
    "correoInstitucional" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "programaAcademicoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "docentes" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "documentoIdentidad" TEXT NOT NULL,
    "tituloProfesional" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "correoInstitucional" TEXT NOT NULL,
    "telefono" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "docentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignaturas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "creditos" INTEGER NOT NULL,
    "programaAcademicoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asignaturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periodos_academicos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "periodos_academicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignaciones_docente" (
    "id" SERIAL NOT NULL,
    "docenteId" INTEGER NOT NULL,
    "asignaturaId" INTEGER NOT NULL,
    "periodoAcademicoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asignaciones_docente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matriculas" (
    "id" SERIAL NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "asignacionDocenteId" INTEGER NOT NULL,
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matriculas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calificaciones" (
    "id" SERIAL NOT NULL,
    "matriculaId" INTEGER NOT NULL,
    "nota1" DOUBLE PRECISION NOT NULL,
    "nota2" DOUBLE PRECISION NOT NULL,
    "nota3" DOUBLE PRECISION NOT NULL,
    "notaDefinitiva" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "programas_academicos_codigo_key" ON "programas_academicos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_codigoEstudiantil_key" ON "estudiantes"("codigoEstudiantil");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_documentoIdentidad_key" ON "estudiantes"("documentoIdentidad");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_correoInstitucional_key" ON "estudiantes"("correoInstitucional");

-- CreateIndex
CREATE UNIQUE INDEX "docentes_documentoIdentidad_key" ON "docentes"("documentoIdentidad");

-- CreateIndex
CREATE UNIQUE INDEX "docentes_correoInstitucional_key" ON "docentes"("correoInstitucional");

-- CreateIndex
CREATE UNIQUE INDEX "asignaturas_codigo_key" ON "asignaturas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "periodos_academicos_nombre_key" ON "periodos_academicos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "asignaciones_docente_docenteId_asignaturaId_periodoAcademic_key" ON "asignaciones_docente"("docenteId", "asignaturaId", "periodoAcademicoId");

-- CreateIndex
CREATE UNIQUE INDEX "matriculas_estudianteId_asignacionDocenteId_key" ON "matriculas"("estudianteId", "asignacionDocenteId");

-- CreateIndex
CREATE UNIQUE INDEX "calificaciones_matriculaId_key" ON "calificaciones"("matriculaId");

-- AddForeignKey
ALTER TABLE "estudiantes" ADD CONSTRAINT "estudiantes_programaAcademicoId_fkey" FOREIGN KEY ("programaAcademicoId") REFERENCES "programas_academicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaturas" ADD CONSTRAINT "asignaturas_programaAcademicoId_fkey" FOREIGN KEY ("programaAcademicoId") REFERENCES "programas_academicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_docente" ADD CONSTRAINT "asignaciones_docente_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "docentes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_docente" ADD CONSTRAINT "asignaciones_docente_asignaturaId_fkey" FOREIGN KEY ("asignaturaId") REFERENCES "asignaturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_docente" ADD CONSTRAINT "asignaciones_docente_periodoAcademicoId_fkey" FOREIGN KEY ("periodoAcademicoId") REFERENCES "periodos_academicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "estudiantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_asignacionDocenteId_fkey" FOREIGN KEY ("asignacionDocenteId") REFERENCES "asignaciones_docente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_matriculaId_fkey" FOREIGN KEY ("matriculaId") REFERENCES "matriculas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
