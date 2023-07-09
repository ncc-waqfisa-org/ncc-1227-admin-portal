import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Input } from "../input";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const formSchema = z.object({
    page: z.number(),
  });
  const goToForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      page: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const page = values.page ? Number(values.page) - 1 : 0;
    table.setPageIndex(page);
  }

  return (
    <div className="flex flex-wrap items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex flex-wrap items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden w-8 h-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>

          <Form {...goToForm}>
            <form onSubmit={goToForm.handleSubmit(onSubmit)} className="">
              <FormField
                control={goToForm.control}
                name="page"
                render={({ field }) => (
                  <FormItem
                    className="max-w-[4rem]"
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={(e: any) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      table.setPageIndex(page);
                    }}
                  >
                    <FormControl>
                      <Input
                        className="h-8 text-center"
                        placeholder={(
                          table.getState().pagination.pageIndex + 1
                        ).toString()}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <Button
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden w-8 h-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
