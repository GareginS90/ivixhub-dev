DO $$
DECLARE
    r record;
BEGIN
    -- Drop all CHECK constraints on psychologist_methods
    FOR r IN
        SELECT con.conname
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
        WHERE rel.relname = 'psychologist_methods'
          AND nsp.nspname = 'public'
          AND con.contype = 'c'
    LOOP
        EXECUTE format('ALTER TABLE public.psychologist_methods DROP CONSTRAINT IF EXISTS %I', r.conname);
    END LOOP;

    -- Drop all CHECK constraints on psychologist_specializations
    FOR r IN
        SELECT con.conname
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
        WHERE rel.relname = 'psychologist_specializations'
          AND nsp.nspname = 'public'
          AND con.contype = 'c'
    LOOP
        EXECUTE format('ALTER TABLE public.psychologist_specializations DROP CONSTRAINT IF EXISTS %I', r.conname);
    END LOOP;
END $$;

ALTER TABLE public.psychologist_methods
    ALTER COLUMN method TYPE varchar(64);

ALTER TABLE public.psychologist_specializations
    ALTER COLUMN specialization TYPE varchar(100);
