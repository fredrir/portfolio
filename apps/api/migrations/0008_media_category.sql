alter table media add column category text
    check (category is null or char_length(category) <= 64);
